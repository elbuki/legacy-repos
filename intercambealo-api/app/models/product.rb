## Product model
# No empty/null spaces
class Product < ActiveRecord::Base
	belongs_to :user
	validates :name, :description, presence: true
	validates :state, inclusion: { in: [true, false] }
end
