## Transaction model
# No empty spaces
# A transaction should hold one product
class Transaction < ActiveRecord::Base
    before_update :interchange_products
    validates :requested_id, :offered_id, presence: true
    has_one :product

    def interchange_products
        requested = Product.find(self.requested_id)
        offered = Product.find(self.offered_id)
        requested_owner_id = requested.owner_id
        requested.update(owner_id: offered.owner_id)
        offered.update(owner_id: requested_owner_id)
    end
end
