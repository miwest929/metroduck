class InstallationGuideController < ApplicationController
  def get
    repo_name = params[:repo]
    old_branch = params[:old_branch]
    new_branch = params[:new_branch]
    old_path = params[:old_path]
    new_path = params[:new_path]

    repo = Github::Repo.new(repo_name)
    old_guide = repo.file(old_path, old_branch)
    new_guide = repo.file(new_path, new_branch)

    if old_guide && new_guide
      old_guide = old_guide.encode('utf-8', :invalid => :replace, :undef => :replace, :replace => '_')
      new_guide = new_guide.encode('utf-8', :invalid => :replace, :undef => :replace, :replace => '_')
      File.open("tmp/old_guide.md", 'w') {|f| f.write(old_guide) }
      File.open("tmp/new_guide.md", 'w') {|f| f.write(new_guide) }

      differ = %x(diff -a -b tmp/old_guide.md tmp/new_guide.md)

      render json: {contents: differ}
    elsif old_guide.nil?
      render status: 422, json: {error: "No installation guide was found on the currently deployed branch."}
    else
      render status: 422, json: {error: "No installation guide was found on the new branch."}
    end
  end
end
