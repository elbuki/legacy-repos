## User model
# Username must be unique
# No empty/null spaces
# A user has more than one session
# If an user is deleted, it destroys their sessions too!
class User < ActiveRecord::Base
	validates :username, uniqueness: true
	validates :username, :firstname, :password, presence: true
	has_many :sessions, :dependent => :destroy
end
