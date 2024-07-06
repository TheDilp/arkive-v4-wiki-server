use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct RelatedCharacter {
    id: Uuid,
    full_name: String,
    portrait_id: Option<String>,
    project_id: Uuid,
}
#[derive(Serialize, Deserialize)]
pub struct CharacterFieldCharacters {
    related_id: Uuid,
    character: RelatedCharacter,
}

#[derive(Serialize, Deserialize)]
pub struct CharacterField {
    id: Uuid,
    title: Option<String>,
    sort: Option<i64>,
    parent_id: Option<Uuid>,
    field_type: String,
    characters: Vec<CharacterFieldCharacters>, // blueprint_instances: {
                                               //   blueprint_instance: Pick<BlueprintInstanceType, "id" | "title" | "parent_id"> & { icon: string; project_id: string };
                                               //   related_id: string;
                                               // }[];
                                               // documents: {
                                               //   document: Pick<DocumentType, "id" | "title" | "icon" | "project_id">;
                                               //   related_id: string;
                                               // }[];
                                               // map_pins: {
                                               //   map_pin: Pick<MapPinType, "id" | "title" | "icon" | "parent_id"> & { project_id: string };
                                               //   related_id: string;
                                               // }[];
                                               // images: {
                                               //   image: Pick<ImageType, "id" | "title" | "project_id">;
                                               //   related_id: string;
                                               // }[];
                                               // events: {
                                               //   event: Pick<EventType, "id" | "title" | "parent_id"> & { project_id: string };
                                               //   related_id: string;
                                               // }[];

                                               // random_table: {
                                               //   option_id?: string;
                                               //   suboption_id?: string;
                                               //   related_id: string;
                                               // };
                                               // calendar: {
                                               //   related_id: string;

                                               //   start_day?: number;
                                               //   start_year?: number;
                                               //   start_month_id?: string;

                                               //   end_day?: number;
                                               //   end_month_id?: string;
                                               //   end_year?: number;
                                               // };
                                               // random_table_data: Pick<RandomTableType, "id" | "title">;
                                               // value: string | number | null | string[] | number[];
}
#[derive(Serialize, Deserialize)]
pub struct PublicCharacterData {
    pub id: Uuid,
    pub full_name: String,
    pub portrait_id: Option<Uuid>,
    pub is_public: Option<bool>,
    pub age: Option<i32>,
    pub biography: Option<Value>,
    pub character_fields: Vec<CharacterField>,
}
