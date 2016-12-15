class ChangeCreatedAtName < ActiveRecord::Migration
  def up
  	rename_column :sessions, :created_at, :expires_at
  end

  def down
  	rename_column :sessions, :expires_at, :created_at
  end
end
