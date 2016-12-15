class ChangePasswordFormatUser < ActiveRecord::Migration
  def up
  	change_column :users, :password, :string
  end

  def down
  	change_column :users, :password, :binary
  end
end
