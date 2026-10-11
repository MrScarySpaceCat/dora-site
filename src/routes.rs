use chrono::{DateTime, Utc};
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
                data: || json!({ "exactage": Utc::now().years_since(DateTime::from_timestamp(1214557200, 0).expect("Invalid timestamp")).expect("Exact years couldn't be calculated") }),
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
