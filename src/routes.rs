use chrono::{Datelike, Utc};
use serde_json::{Value, json};

pub struct Route {
    pub path: &'static str,
    pub template: &'static str,
    pub data: fn() -> Value,
}

impl Route {
    pub fn all() -> Vec<Route> {
        vec![
            Route {
                path: "",
                template: "index.html",
                data: || json!({ "year": Utc::now().year() }),
            },
            // Add new pages here:
            // Route {
            //     path: "about",
            //     template: "about.html",
            //     data: || json!({ "title": "About" }),
            // },
        ]
    }
}
