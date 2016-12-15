# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160427193128) do

  create_table "products", force: :cascade do |t|
    t.string  "name",        limit: 255
    t.string  "description", limit: 255
    t.boolean "state"
    t.integer "owner_id",    limit: 4
    t.string  "image",       limit: 255
  end

  add_index "products", ["owner_id"], name: "fk_rails_7536ff0cd9", using: :btree

  create_table "sessions", force: :cascade do |t|
    t.integer  "user_id",    limit: 4
    t.string   "auth_token", limit: 255
    t.datetime "expires_at"
  end

  add_index "sessions", ["user_id"], name: "index_sessions_on_user_id", using: :btree

  create_table "transactions", force: :cascade do |t|
    t.integer  "requested_id", limit: 4
    t.integer  "offered_id",   limit: 4
    t.boolean  "finalized"
    t.datetime "created_at"
  end

  add_index "transactions", ["offered_id"], name: "fk_rails_795b6149f8", using: :btree
  add_index "transactions", ["requested_id"], name: "fk_rails_e006023c5d", using: :btree

  create_table "users", force: :cascade do |t|
    t.string "username",  limit: 255
    t.string "password",  limit: 255
    t.string "firstname", limit: 255
  end

  add_foreign_key "products", "users", column: "owner_id"
  add_foreign_key "sessions", "users"
  add_foreign_key "transactions", "products", column: "offered_id"
  add_foreign_key "transactions", "products", column: "requested_id"
end
