class InstallationGuideController < ApplicationController
  def get
    repo = Github::Repo.new( params[:repo] )

    render json: {contents: repo.file('docs/installation_guide.md', params[:branch])}
  end
end
