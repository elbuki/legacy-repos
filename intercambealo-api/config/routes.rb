## Routes file
# It doesn't follow all the RESTful actions since no controller implements all the actions.
Rails.application.routes.draw do
	get "products", to: "products#index"
	post "products", to: "products#create"
	put "products", to: "products#update"
	get "products/:id", to: "products#show", constraints: { id: /\d+/ }
	get "products/:name", to: "products#search", constraints: { name: /[a-zA-Z]+/ }
	delete "products/:id", to: "products#destroy"
	
    	post "session/authenticate", to: "authentication#auth"
    	get "session/logout", to: "authentication#logout"

    	post 'user/', to: 'users#register'
	put 'user/:id', to: 'users#edit'
	delete 'user/:id', to: 'users#destroy'

	get "transaction", to: "transactions#index"
	post "transaction", to: "transactions#create"
	get "transaction/finalize/:id", to: "transactions#finalize"
	delete "transaction/:id", to: "transactions#destroy"
end
