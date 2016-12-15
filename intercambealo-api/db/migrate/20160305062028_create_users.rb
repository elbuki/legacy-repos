class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :username
      t.binary :password
      t.string :firstname
    end
  end
end
