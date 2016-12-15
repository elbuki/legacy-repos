## Products controller
# index, returns all the products
# create, creates a new product based on the str_params
# update, updates a product using a product found by the exists function
# destroy, deletes a product
# show, finds a product using the id
# search, finds a product using the name
# exists?, returns a product object using the id and stores it in a instance variable
# str_params, strong parameters
class ProductsController < ApplicationController
  before_filter :require_auth
  before_filter :exists?, only: [:update, :destroy, :show]

  def index
        if params['filter'] === 'mine'
           render json: Product.connection.select_rows("SELECT p.id, p.name, p.description, p.state, u.username FROM products as p, users as u where p.owner_id = u.id and p.owner_id = #{get_user_logged.id}")
         else
           render json: Product.connection.select_rows("SELECT p.id, p.name, p.description, p.state, u.username FROM products as p, users as u where p.owner_id = u.id and p.owner_id <> #{get_user_logged.id}")
         end
    end

    def create
        # detect owner id
        unless Product.create(str_params).save
          render json: { 
            "error" => "You either may have not entered all the required information. (title, description, state)" 
          }, status: 422
        else
            render :nothing => true, status: 201
        end
    end

  def update
        @product.update(str_params)
    end

    def destroy
        @product.destroy
    end

  def show
            render json: @product
    end

    def search
      render json: Product.find_by!(name: params[:name]) 
      rescue ActiveRecord::RecordNotFound
        render json: { "error": "Product not found." }, status: 404
    end

  private

    def exists?
      @product = Product.find(params[:id])
      rescue ActiveRecord::RecordNotFound
          render json: { "error": "Product not found." }, status: 404
        end

        def str_params
            p = params.permit(:id, :name, :description, :state, :image)
            p[:owner_id] = get_user_logged.id
            p
        end
end
