use std::env;

use axum::{
    extract::{ Path, State },
    http::{ header::CONTENT_TYPE, HeaderValue, StatusCode },
    response::IntoResponse,
    routing::get,
    Json,
    Router,
};
use deadpool_postgres::{ Config, ManagerConfig, Runtime };
use dotenv::dotenv;
use models::{ app_state::AppState, entities::Entites };
use serde_json::json;
use tokio::net::TcpListener;
use tokio_postgres::NoTls;
use tower_http::cors::{ AllowOrigin, Cors, CorsLayer };
use utils::db_utils::get_client;
use uuid::Uuid;

mod utils;
mod models;

async fn get_entities(
    State(state): State<AppState>,
    Path((project_id, entity)): Path<(Uuid, Entites)>
) -> impl IntoResponse {
    let client = get_client(&state.pool).await.unwrap();

    let rows = client.query(entity.list_string().as_str(), &[&project_id]).await;

    if rows.is_err() {
        return (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"ok": true})));
    }

    let rows = rows.unwrap();

    let data = entity.to_json_list(rows);

    return (StatusCode::OK, data);
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("NO DATABASE URL CONFIGURED");
    let port = env::var("PORT").expect("NO PORT CONFIGURED");
    let client_url = env::var("CLIENT_URL").expect("NO CLIENT URL CONFIGURED");

    let origins = AllowOrigin::list([HeaderValue::from_str(&client_url).unwrap()]);
    let cors = CorsLayer::new().allow_origin(origins).allow_headers([CONTENT_TYPE]);

    let mut cfg = Config::new();
    cfg.manager = Some(ManagerConfig {
        recycling_method: deadpool_postgres::RecyclingMethod::Fast,
    });
    cfg.url = Some(database_url);
    let pool = cfg.create_pool(Some(Runtime::Tokio1), NoTls).unwrap();

    let listener = TcpListener::bind(format!("0.0.0.0:{}", port)).await.unwrap();

    let main_router = Router::new()
        .route("/:project_id/:entity", get(get_entities))
        .with_state(AppState { pool })
        .layer(cors);

    println!("Listening on port {} 🚀", port);
    axum::serve(listener, main_router).await.unwrap();
}
