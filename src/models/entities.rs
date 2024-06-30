use axum::Json;
use serde::{ Deserialize, Serialize };
use serde_json::Value;
use tokio_postgres::Row;
use uuid::Uuid;
#[derive(Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Entites {
    Characters,
    Blueprints,
    Documents,
    Maps,
    Graphs,
    Calendars,
    Dictionaries,
}

impl Entites {
    fn select_string(&self) -> &str {
        match self {
            Self::Characters =>
                "SELECT id, portrait_id as image_id, full_name, is_public FROM characters ",
            Self::Blueprints =>
                "SELECT blueprint_instances.id, blueprint_instances.title, blueprint_instances.is_public, blueprints.icon FROM blueprint_instances ",
            Self::Documents => "SELECT id, title, image_id, icon, is_public FROM documents",
            Self::Maps => "SELECT id, title, image_id, icon, is_public FROM maps",
            Self::Graphs => "SELECT id, title, icon, is_public FROM graphs",
            Self::Calendars => "SELECT id, title, icon, is_public FROM calendars",
            Self::Dictionaries => "SELECT id, title, icon, is_public FROM dictionaries",
        }
    }
    fn where_string(&self) -> &str {
        match self {
            Self::Blueprints =>
                "LEFT JOIN blueprints ON blueprints.id = blueprint_instances.parent_id WHERE blueprints.project_id = $1 AND blueprint_instances.is_public = TRUE",
            _ => " WHERE project_id = $1 AND is_public = TRUE",
        }
    }
    fn to_character(&self, row: &Row) -> PublicCharacter {
        return PublicCharacter {
            id: row.get("id"),
            full_name: row.get("full_name"),
            image_id: row.get("image_id"),
            is_public: row.get("is_public"),
        };
    }
    fn to_blueprint(&self, row: &Row) -> PublicBlueprint {
        return PublicBlueprint {
            id: row.get("id"),
            title: row.get("title"),
            icon: row.get("icon"),
            is_public: row.get("is_public"),
        };
    }
    fn to_document(&self, row: &Row) -> PublicDocument {
        return PublicDocument {
            id: row.get("id"),
            title: row.get("title"),
            icon: row.get("icon"),
            image_id: row.get("image_id"),
            is_public: row.get("is_public"),
        };
    }
    fn to_map(&self, row: &Row) -> PublicMap {
        return PublicMap {
            id: row.get("id"),
            title: row.get("title"),
            icon: row.get("icon"),
            image_id: row.get("image_id"),
            is_public: row.get("is_public"),
        };
    }
    fn to_graph(&self, row: &Row) -> PublicGraph {
        return PublicGraph {
            id: row.get("id"),
            title: row.get("title"),
            icon: row.get("icon"),
            is_public: row.get("is_public"),
        };
    }
    fn to_calendar(&self, row: &Row) -> PublicCalendars {
        return PublicCalendars {
            id: row.get("id"),
            title: row.get("title"),
            icon: row.get("icon"),
            is_public: row.get("is_public"),
        };
    }
    fn to_dictionary(&self, row: &Row) -> PublicDictionaries {
        return PublicDictionaries {
            id: row.get("id"),
            title: row.get("title"),
            icon: row.get("icon"),
            is_public: row.get("is_public"),
        };
    }

    pub fn list_string(&self) -> String {
        return format!("{} {};", self.select_string(), self.where_string());
    }

    pub fn to_json_list(&self, rows: Vec<Row>) -> Json<Value> {
        return match self {
            Self::Characters => {
                let data: Vec<PublicCharacter> = rows
                    .iter()
                    .map(|row| self.to_character(row))
                    .collect();
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Blueprints => {
                let data: Vec<PublicBlueprint> = rows
                    .iter()
                    .map(|row| self.to_blueprint(row))
                    .collect();
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Documents => {
                let data: Vec<PublicDocument> = rows
                    .iter()
                    .map(|row| self.to_document(row))
                    .collect();
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Maps => {
                let data: Vec<PublicMap> = rows
                    .iter()
                    .map(|row| self.to_map(row))
                    .collect();
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Graphs => {
                let data: Vec<PublicGraph> = rows
                    .iter()
                    .map(|row| self.to_graph(row))
                    .collect();
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Calendars => {
                let data: Vec<PublicCalendars> = rows
                    .iter()
                    .map(|row| self.to_calendar(row))
                    .collect();
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Dictionaries => {
                let data: Vec<PublicDictionaries> = rows
                    .iter()
                    .map(|row| self.to_dictionary(row))
                    .collect();
                Json(serde_json::to_value(data).unwrap())
            }
        };
    }
}

#[derive(Serialize, Deserialize)]
pub struct PublicCharacter {
    pub id: Uuid,
    pub full_name: String,
    pub image_id: Option<Uuid>,
    pub is_public: Option<bool>,
}

#[derive(Serialize, Deserialize)]
pub struct PublicBlueprint {
    pub id: Uuid,
    pub title: String,
    pub icon: Option<String>,
    pub is_public: Option<bool>,
}
#[derive(Serialize, Deserialize)]
pub struct PublicDocument {
    pub id: Uuid,
    pub title: String,
    pub image_id: Option<Uuid>,
    pub icon: Option<String>,
    pub is_public: Option<bool>,
}

#[derive(Serialize, Deserialize)]
pub struct PublicMap {
    pub id: Uuid,
    pub title: String,
    pub icon: Option<String>,
    pub image_id: Option<Uuid>,
    pub is_public: Option<bool>,
}

#[derive(Serialize, Deserialize)]
pub struct PublicGraph {
    pub id: Uuid,
    pub title: String,
    pub icon: Option<String>,
    pub is_public: Option<bool>,
}
#[derive(Serialize, Deserialize)]
pub struct PublicCalendars {
    pub id: Uuid,
    pub title: String,
    pub icon: Option<String>,
    pub is_public: Option<bool>,
}

#[derive(Serialize, Deserialize)]
pub struct PublicDictionaries {
    pub id: Uuid,
    pub title: String,
    pub icon: Option<String>,
    pub is_public: Option<bool>,
}
