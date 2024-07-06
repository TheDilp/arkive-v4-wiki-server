use axum::Json;
use serde::{Deserialize, Serialize};
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

impl ToString for Entites {
    fn to_string(&self) -> String {
        String::from(match self {
            Self::Characters => "characters",
            Self::Blueprints => "blueprint_instances",
            Self::Documents => "documents",
            Self::Maps => "maps",
            Self::Graphs => "graphs",
            Self::Calendars => "calendars",
            Self::Dictionaries => "dictionaries",
        })
    }
}




impl Entites {
    fn read_select_string(&self) -> &str {
        match self {
            Self::Characters =>
                "SELECT 
                    characters.id, 
                    characters.full_name AS title, 
                    characters.age, 
                    characters.biography,
                    characters.is_public, 
                    images.id AS image_id,
                    sub.characters
                FROM characters
                LEFT JOIN images ON images.id = characters.portrait_id AND images.is_public = TRUE
                LEFT JOIN (
                SELECT 
                    character_field_id AS id,
                    character_characters_fields.related_id,
                    (
                    SELECT json_agg(row_to_json(chars))
                    FROM (
                        SELECT 
                        chars.id, 
                        chars.full_name, 
                        chars.portrait_id
                        FROM characters chars
                        WHERE chars.id = character_characters_fields.related_id
                    ) AS chars
                    ) AS characters
                FROM character_characters_fields
                WHERE character_characters_fields.character_id = $2
                ) AS sub ON sub.related_id = characters.id",
            Self::Blueprints =>
                "SELECT blueprint_instances.id, blueprint_instances.title, blueprint_instances.is_public, blueprints.icon FROM blueprint_instances ",
            Self::Documents => "SELECT id, title, image_id, icon, is_public FROM documents",
            Self::Maps => "SELECT id, title, image_id, icon, is_public FROM maps",
            Self::Graphs => "SELECT id, title, icon, is_public FROM graphs",
            Self::Calendars => "SELECT id, title, icon, is_public FROM calendars",
            Self::Dictionaries => "SELECT id, title, icon, is_public FROM dictionaries",
        }
    }
    fn list_select_string(&self) -> &str {
        match self {
            Self::Characters =>
                "SELECT characters.id, characters.full_name, characters.is_public, images.id as portrait_id FROM characters LEFT JOIN images ON images.id = characters.portrait_id AND images.is_public = TRUE ",
            Self::Blueprints =>
                "SELECT blueprint_instances.id, blueprint_instances.title, blueprint_instances.is_public, blueprints.icon FROM blueprint_instances ",
            Self::Documents => "SELECT id, title, image_id, icon, is_public FROM documents",
            Self::Maps => "SELECT id, title, image_id, icon, is_public FROM maps",
            Self::Graphs => "SELECT id, title, icon, is_public FROM graphs",
            Self::Calendars => "SELECT id, title, icon, is_public FROM calendars",
            Self::Dictionaries => "SELECT id, title, icon, is_public FROM dictionaries",
        }
    }
    fn list_where_string(&self) -> String {
        match self {
            Self::Blueprints =>
                "LEFT JOIN blueprints ON blueprints.id = blueprint_instances.parent_id WHERE blueprints.project_id = $1 AND blueprint_instances.is_public = TRUE".to_string(),
            _ => format!(
                " WHERE {entity}.project_id = $1 AND {entity}.is_public = TRUE",
                entity = self.to_string().as_str()
            )
            
        }
    }
    fn read_where_string(&self) -> String {
        match self {
            Self::Blueprints =>
                "LEFT JOIN blueprints ON blueprints.id = blueprint_instances.parent_id WHERE blueprints.project_id = $1
                AND blueprint_instances.id = $2 AND blueprint_instances.is_public = TRUE".to_string(),
            _ => {
                return format!(
                    " WHERE {entity}.project_id = $1 AND {entity}.id = $2 AND {entity}.is_public = TRUE",
                    entity = self.to_string().as_str()
                );
            }
        }
    }

    fn order_by(&self) -> &str {
        return "ORDER BY title;";
    }
    fn to_character_list(&self, row: &Row) -> PublicCharacterList {
        return PublicCharacterList {
            id: row.get("id"),
            full_name: row.get("full_name"),
            portrait_id: row.get("portrait_id"),
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

    pub fn read_string(&self) -> String {
        return format!(
            "{} {};",
            self.read_select_string(),
            self.read_where_string()
        );
    }
    pub fn list_string(&self) -> String {
        return format!(
            "{} {} {};",
            self.list_select_string(),
            self.list_where_string(),
            self.order_by()
        );
    }

    pub fn to_json_list(&self, rows: Vec<Row>) -> Json<Value> {
        return match self {
            Self::Characters => {
                let data: Vec<PublicCharacterList> =
                    rows.iter().map(|row| self.to_character_list(row)).collect();
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Blueprints => {
                let data: Vec<PublicBlueprint> =
                    rows.iter().map(|row| self.to_blueprint(row)).collect();
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Documents => {
                let data: Vec<PublicDocument> =
                    rows.iter().map(|row| self.to_document(row)).collect();
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Maps => {
                let data: Vec<PublicMap> = rows.iter().map(|row| self.to_map(row)).collect();
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Graphs => {
                let data: Vec<PublicGraph> = rows.iter().map(|row| self.to_graph(row)).collect();
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Calendars => {
                let data: Vec<PublicCalendars> =
                    rows.iter().map(|row| self.to_calendar(row)).collect();
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Dictionaries => {
                let data: Vec<PublicDictionaries> =
                    rows.iter().map(|row| self.to_dictionary(row)).collect();
                Json(serde_json::to_value(data).unwrap())
            }
        };
    }
    pub fn to_json_read(&self, row: Row) -> Json<Value> {
        return match self {
            Self::Characters => {
                let data: PublicCharacterList = self.to_character_list(&row);
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Blueprints => {
                let data: PublicBlueprint = self.to_blueprint(&row);
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Documents => {
                let data: PublicDocument = self.to_document(&row);
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Maps => {
                let data: PublicMap = self.to_map(&row);
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Graphs => {
                let data: PublicGraph = self.to_graph(&row);
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Calendars => {
                let data: PublicCalendars = self.to_calendar(&row);
                Json(serde_json::to_value(data).unwrap())
            }
            Self::Dictionaries => {
                let data: PublicDictionaries = self.to_dictionary(&row);
                Json(serde_json::to_value(data).unwrap())
            }
        };
    }
}



#[derive(Serialize, Deserialize)]
pub struct PublicCharacterList {
    pub id: Uuid,
    pub full_name: String,
    pub portrait_id: Option<Uuid>,
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
