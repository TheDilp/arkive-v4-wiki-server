use std::env;

use axum::{
    extract::{Path, State},
    http::{header::CONTENT_TYPE, HeaderValue, StatusCode},
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use deadpool_postgres::{Config, ManagerConfig, Runtime};
use dotenv::dotenv;
use models::{app_state::AppState, character::PublicCharacterData, entities::Entites};
use serde_json::{json, Value};
use tokio::net::TcpListener;
use tokio_postgres::NoTls;
use tower_http::cors::{AllowOrigin, CorsLayer};
use tracing::error;
use utils::db_utils::get_client;
use uuid::Uuid;

mod models;
mod utils;

async fn get_entity(
    State(state): State<AppState>,
    Path((project_id, entity, id)): Path<(Uuid, Entites, Uuid)>,
) -> impl IntoResponse {
    let client = get_client(&state.pool).await.unwrap();

    let row = client
        .query_one(entity.read_string().as_str(), &[&project_id, &id])
        .await;

    if row.is_err() {
        error!("{}", row.err().unwrap());
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"ok": false})),
        );
    }

    let row = row.unwrap();

    return (StatusCode::OK, entity.to_json_read(row));
}

async fn get_entities(
    State(state): State<AppState>,
    Path((project_id, entity)): Path<(Uuid, Entites)>,
) -> impl IntoResponse {
    let client = get_client(&state.pool).await.unwrap();

    let rows = client
        .query(entity.list_string().as_str(), &[&project_id])
        .await;

    if rows.is_err() {
        error!("{}", rows.err().unwrap());
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"ok": false})),
        );
    }

    let rows = rows.unwrap();

    return (StatusCode::OK, entity.to_json_list(rows));
}

async fn get_character(
    State(state): State<AppState>,
    Path((project_id, id)): Path<(Uuid, Uuid)>,
) -> impl IntoResponse {
    let client = get_client(&state.pool).await.unwrap();

    let results = futures::future::join_all([
        // Character data
        client.query_one(
            "SELECT characters.id, characters.full_name, images.id as portrait_id,
                    characters.is_public, characters.age, characters.biography
            FROM characters
            LEFT JOIN images ON images.id = characters.portrait_id AND images.is_public = TRUE
            WHERE characters.is_public = TRUE AND characters.project_id = $1 AND characters.id = $2;
            ",
            &[&project_id, &id]
        ),
        // Character character fields data
        client.query_one(
            "SELECT json_agg(row_to_json(characters)) as character_characters_fields
                FROM (
                SELECT 
                    characters.id, 
                    characters.full_name as title, 
                    characters.portrait_id as image_id
                FROM characters
                LEFT JOIN 
                    character_characters_fields ON character_characters_fields.character_id = $1
                WHERE characters.id = character_characters_fields.related_id
                ) AS characters
            ",
            &[&id]
        ),
        // Blueprint instance character fields data
        client.query_one(
            "SELECT json_agg(row_to_json(blueprint_instances)) as blueprint_instance_characters_fields
                FROM (
                SELECT 
                    blueprint_instances.id, 
                    blueprint_instances.title, 
                    blueprints.icon
                FROM blueprint_instances
                LEFT JOIN 
                    blueprints ON blueprints.id = blueprint_instances.parent_id
                LEFT JOIN 
                    character_blueprint_instance_fields ON character_blueprint_instance_fields.character_id = $1
                WHERE blueprint_instances.id = character_blueprint_instance_fields.related_id
                ) AS blueprint_instances
            ",
            &[&id]
        ),
        // Document character fields data
        client.query_one(
            "SELECT json_agg(row_to_json(documents)) as document_character_fields
                FROM (
                SELECT 
                    documents.id, 
                    documents.title, 
                    documents.icon,
                    documents.image_id
                FROM documents
                LEFT JOIN 
                    character_documents_fields ON character_documents_fields.character_id = $1
                WHERE documents.id = character_documents_fields.related_id
                ) AS documents
            ",
            &[&id]
        ),
    ]).await;

    if let [character, character_char_fields, bpi_char_fields, document_char_fields] = &results[0..]
    {
        if character.is_err() {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"ok": false})),
            );
        }

        let character = character.as_ref().unwrap();

        let character_character_fields: Option<Value> = character_char_fields
            .as_ref()
            .unwrap()
            .get("character_characters_fields");
        let blueprint_instance_character_fields: Option<Value> = bpi_char_fields
            .as_ref()
            .unwrap()
            .get("blueprint_instance_characters_fields");
        let document_character_fields: Option<Value> = document_char_fields
            .as_ref()
            .unwrap()
            .get("document_character_fields");

        let data = PublicCharacterData {
            id: character.get("id"),
            full_name: character.get("full_name"),
            portrait_id: character.get("portrait_id"),
            age: character.get("age"),
            biography: character.get("biography"),
            is_public: character.get("is_public"),
            character_fields: Vec::new(),
        };

        return (StatusCode::OK, Json(serde_json::to_value(data).unwrap()));
    }

    return (StatusCode::OK, Json(json!({"ok": true})));
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("NO DATABASE URL CONFIGURED");
    let port = env::var("PORT").expect("NO PORT CONFIGURED");
    let client_url = env::var("CLIENT_URL").expect("NO CLIENT URL CONFIGURED");

    let origins = AllowOrigin::list([HeaderValue::from_str(&client_url).unwrap()]);
    let cors = CorsLayer::new()
        .allow_origin(origins)
        .allow_headers([CONTENT_TYPE]);

    let mut cfg = Config::new();
    cfg.manager = Some(ManagerConfig {
        recycling_method: deadpool_postgres::RecyclingMethod::Fast,
    });
    cfg.url = Some(database_url);
    let pool = cfg.create_pool(Some(Runtime::Tokio1), NoTls).unwrap();

    let listener = TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();

    let main_router = Router::new()
        .route("/:project_id/:entity", get(get_entities))
        .route("/:project_id/characters/:id", get(get_character))
        .with_state(AppState { pool })
        .layer(cors);

    println!("Listening on port {} 🚀", port);
    axum::serve(listener, main_router).await.unwrap();
}
