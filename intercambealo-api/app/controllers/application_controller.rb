## Application controller
# Has methods that are inherited in every controller.
# require_auth checks that a user is authenticated using a token
# encrypt returns a string hash using SHA-512.
class ApplicationController < ActionController::API

    protected
        def require_auth
            user_session = Session.find_by(auth_token: request.headers['Authorization']);
            if user_session.nil? # If the user doesn't have a token
                render json: { "error": "You need to authenticate in order to perform that action." },
                        status: 401
                false
            else
                # If the session is expired, converts to UTC due to time zone differences
                if user_session.expires_at.utc < Time.now.utc
                    user_session.destroy
                    render json: 
                        { "error": "Your session have been expired! Please authenticate again." }, 
                        status: 401
                    false
                else
                    user_session.update(expires_at: Time.now.utc + 30.minutes)
                    user_session.save
                end
            end
        end

        def get_user_logged
            User.find(Session.find_by(auth_token: request.headers['Authorization']).user_id)
        end

        def encrypt message
            Digest::SHA2.new(512).hexdigest(message)
        end
end
