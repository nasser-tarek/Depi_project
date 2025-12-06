pipeline {
  agent any

  environment {
    DOCKERHUB_ORG = 'nasser1tarek'          
    BACKEND_IMAGE = "${DOCKERHUB_ORG}/depi_backend"
    FRONTEND_IMAGE = "${DOCKERHUB_ORG}/depi_frontend"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM', branches: [[name: '*/main']],
                  userRemoteConfigs: [[url: 'https://github.com/nasser-tarek/Depi_project.git']]])
      }
    }

    stage('Prepare tags') {
      steps {
        script {
          GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          IMAGE_TAG = "${GIT_COMMIT_SHORT}"
          IMAGE_LATEST = "latest"
          echo "Will tag images as: ${IMAGE_TAG} and ${IMAGE_LATEST}"
        }
      }
    }

    stage('Build backend image') {
      steps {
        script {
          sh """
            docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -t ${BACKEND_IMAGE}:${IMAGE_LATEST} ./backend
          """
        }
      }
    }

    stage('Build frontend image') {
      steps {
        script {
          sh """
            docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:${IMAGE_LATEST} ./frontend
          """
        }
      }
    }

    stage('Login to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
          sh 'echo "${DOCKERHUB_PASS}" | docker login -u "${DOCKERHUB_USER}" --password-stdin'
        }
      }
    }

    stage('Push images') {
      steps {
        script {
          sh """
            docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
            docker push ${BACKEND_IMAGE}:${IMAGE_LATEST}
            docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
            docker push ${FRONTEND_IMAGE}:${IMAGE_LATEST}
          """
        }
      }
    }

    stage('Cleanup local images') {
      steps {
        sh """
          docker rmi ${BACKEND_IMAGE}:${IMAGE_TAG} || true
          docker rmi ${BACKEND_IMAGE}:${IMAGE_LATEST} || true
          docker rmi ${FRONTEND_IMAGE}:${IMAGE_TAG} || true
          docker rmi ${FRONTEND_IMAGE}:${IMAGE_LATEST} || true
        """
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
      cleanWs()
    }
    success {
      echo "Images built and pushed: ${BACKEND_IMAGE}, ${FRONTEND_IMAGE}"
    }
    failure {
      echo "Build failed — check logs"
    }
  }
}
