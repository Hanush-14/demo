pipeline {
    agent any

    environment {
        IMAGE = "hanush14/flask-app"
        TAG   = "1.0"
    }

    stages {

        stage("Docker Hub Login") {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                      echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage("Build Docker Image") {
            steps {
                sh 'docker build -t $IMAGE:$TAG .'
            }
        }

        stage("Push Image") {
            steps {
                sh 'docker push $IMAGE:$TAG'
            }
        }

        stage("Deploy to Docker Swarm") {
            steps {
                sh '''
                docker service rm flaskapp || true
                docker service create \
                  --name flaskapp \
                  --replicas 2 \
                  -p 4000:5000 \
                  $IMAGE:$TAG
                '''
            }
        }
    }
}
