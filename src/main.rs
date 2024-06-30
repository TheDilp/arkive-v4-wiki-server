use std::env;

use axum::Router;
use deadpool_postgres::{ Config, ManagerConfig, Runtime };
use dotenv::dotenv;
use models::app_state::AppState;
use tokio::net::TcpListener;
use tokio_postgres::NoTls;

mod models;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("NO DATABASE URL CONFIGURED");
    let port = env::var("PORT").expect("NO PORT CONFIGURED");

    let mut cfg = Config::new();
    cfg.manager = Some(ManagerConfig {
        recycling_method: deadpool_postgres::RecyclingMethod::Fast,
    });
    cfg.url = Some(database_url);
    let pool = cfg.create_pool(Some(Runtime::Tokio1), NoTls).unwrap();

    let listener = TcpListener::bind(format!("0.0.0.0:{}", port)).await.unwrap();
    let client = pool.get().await.unwrap();

    let rows = client
        .query("SELECT full_name FROM characters WHERE is_public = TRUE;", &[]).await
        .unwrap();

    for row in rows {
        let full_name: String = row.get("full_name");
        println!("{}", full_name);
    }

    let main_router = Router::new().with_state(AppState { pool });

    println!("Listening on port {} 🚀", port);
    axum::serve(listener, main_router).await.unwrap();
}
