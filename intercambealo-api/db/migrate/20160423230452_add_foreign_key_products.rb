class AddForeignKeyProducts < ActiveRecord::Migration
  def change
    add_foreign_key :products, :users, column: :owner_id, primary_key: "id"
  end
end

