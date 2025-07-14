# This tells Terraform we are working with Google Cloud
provider "google" {
  project = "trailhead-mvp" # <-- IMPORTANT: Change this to your actual GCP Project ID
  region  = "europe-west2"
  zone    = "europe-west2-a"
}

# This generates a random suffix to ensure our instance name is unique
resource "random_id" "instance_name_suffix" {
  byte_length = 4
}

# This is the main resource block for the database instance
resource "google_sql_database_instance" "main" {
  name             = "hiking-project-db-${random_id.instance_name_suffix.hex}"
  database_version = "POSTGRES_14"
  region           = "europe-west2" # London

  settings {
    # This is a small, cost-effective tier suitable for development
    tier = "db-f1-micro"
  }

  # This prevents the instance from being accidentally deleted
  deletion_protection = false
}

# This creates the actual database (schema) within the instance
resource "google_sql_database" "default" {
  instance = google_sql_database_instance.main.name
  name     = "hikes_db"
}

# This creates a user to log in to the database
resource "google_sql_user" "default" {
  instance = google_sql_database_instance.main.name
  name     = "hike_admin"
  password = "***REMOVED***" # <-- Change this to a strong, unique password
}