class AddFkTransaction < ActiveRecord::Migration
  def change
  	add_foreign_key :transactions, :products, column: :requested_id, primary_key: "id"
  	add_foreign_key :transactions, :products, column: :offered_id, primary_key: "id"
  end
end
