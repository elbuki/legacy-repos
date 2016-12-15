class AddStateToTransaction < ActiveRecord::Migration
  def change
    add_column :transactions, :finalized, :boolean
  end
end
