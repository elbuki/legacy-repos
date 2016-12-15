class AddImageProduct < ActiveRecord::Migration
  def change
    add_column :products, :image, :string
  end
end
