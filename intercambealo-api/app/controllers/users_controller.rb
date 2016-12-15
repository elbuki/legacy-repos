## Users controller
# register, creates an user in the database
# edit, edits an user based in the strong parameters
# destroy, deletes an user
# exists?, returns an user based on the id
# str_params, strong parameters
class UsersController < ApplicationController
	before_filter :require_auth, :exists?, :except => :register

 	def register
                 unless User.create(str_params).save
            		render json: {
            			"error" => "You either may have not entered all the required information or the username is taken." 
            		}, status: 422
            	else	
            		render :nothing => true, status: 201
                 end
  	end

	def edit
		unless @user.update(str_params)
			render json: {
				"error" => "That username is taken."
			}, status: 422
		else
			render :nothing => true, status: 204
		end
	end

	def destroy
		@user.destroy
  	end

  	private
  		def exists?
  			@user = User.find(params[:id])
  			rescue ActiveRecord::RecordNotFound
  				render json: { "error": "User not found." }, status: 404
  		end

  		def str_params
  			params['password'] = encrypt params['password']
  			params.permit(:id, :username, :password, :firstname)
  		end
end
