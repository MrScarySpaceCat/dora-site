mod config;
mod routes;
mod server;
mod templates;

#[tokio::main]
async fn main() {
    server::serve(config::Config::default()).await;
}
