module Github
  class Repo
    attr_accessor :repo

    def initialize(repo_name)
      @repo = repo_name
    end

    def file(filename, branch)
      response = GITHUB.contents(@repo, ref: branch, path: filename)
      Base64.decode64(response.content)
    rescue Octokit::NotFound
      nil
    end
  end
end
