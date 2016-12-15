## Transactions controller
# index, returns all the transactions
# create, creates a transaction in the database using the strong parameters
# str_params, strong parameters
class TransactionsController < ApplicationController
    before_filter :require_auth

    def index
        if params['filter'] === 'requested'
            render json: Transaction.connection.select_rows("SELECT t.id, p.name, u.username, pr.name, us.username, t.finalized FROM transactions AS t, products AS p, users AS u, users AS us, products AS pr WHERE t.requested_id = p.id AND t.offered_id = pr.id AND u.id = p.owner_id AND us.id = pr.owner_id AND t.finalized = false AND us.id = #{get_user_logged.id};")
        else
            render json: Transaction.connection.select_rows("SELECT t.id, p.name, u.username, pr.name, us.username, t.finalized FROM transactions AS t, products AS p, users AS u, users AS us, products AS pr WHERE t.requested_id = p.id AND t.offered_id = pr.id AND u.id = p.owner_id AND us.id = pr.owner_id AND t.finalized = false AND u.id = #{get_user_logged.id};")
        end
    end

    def create
        unless Transaction.new(str_params).save
                render json: { 
                    "error" => "You either may have not entered all the required information. (requested, offered)" 
                }, status: 422
            else
                render :nothing => true, status: 201
            end
            rescue ActiveRecord::InvalidForeignKey
                render json: {
                    "error" => "You must provide the id's of products that are recorded in the database."
                }, status: 422
    end

    def finalize
        t = Transaction.find(params[:id])
        if t.finalized?
            render json: {
                "error" => "This transaction is already finished."
            }, status: 406
            else            
                t.update(finalized: true)
        end
    end

    def destroy
        Transaction.find(params[:id]).destroy
    end

    private

        def str_params
                p = params.permit(:requested_id, :offered_id)
                p[:created_at] = Time.now
                p[:finalized] = false
                p
        end
end
