class AddDateToTransaction < ActiveRecord::Migration
  def change
    add_column :transactions, :created_at, :datetime
  end
end
