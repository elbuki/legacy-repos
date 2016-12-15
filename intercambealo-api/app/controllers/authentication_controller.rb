## Authentication controller
# auth, creates a session and returns an authentication token
# logout, remove a session
# str_params, strong parameters, encrypts the password before returning the object
class AuthenticationController < ApplicationController
	def auth
		user = User.where(str_params)
		unless user.size > 0
			response = { "error" => "User or password invalid" }
			status = 422			
		else
			token = encrypt Time.now.to_s
			response = { "authtoken" => token }
			Session.create(user_id: user.first.id, 
					auth_token: token,
					expires_at: Time.now + 30.minutes).save
		end
		render json: response, status: status || 200
	end

	def logout
		user_session = Session.find_by(auth_token: request.headers['Authorization']);
		unless user_session.nil?
			user_session.destroy
			render :nothing => true, status: 200
		else
			render json: { "error": "Either your user doesn't exist or you're not even logged in." }, 
					status: 422
		end
	end

	private
		def str_params
			params['password'] = encrypt params['password']
			params.permit(:username, :password)	
		end
end
