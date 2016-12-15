class CreateTransactions < ActiveRecord::Migration
  def change
    create_table :transactions do |t|
      t.integer :requested_id
      t.integer :offered_id
    end
  end
end
