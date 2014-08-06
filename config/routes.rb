ExtractDeployGuides::Application.routes.draw do
  root 'home#spa'

  match '/installation_guide', to: 'installation_guide#get', via: [:get]
end
