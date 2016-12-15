## Session model
# A session belongs to user
class Session < ActiveRecord::Base
  belongs_to :user
end
