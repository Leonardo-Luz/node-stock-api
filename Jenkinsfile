pipeline {
  agent any

  environment {
    NODE_ENV = 'production'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Test') {
      steps {
        sh 'npm run test'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t stock-api:latest .'
      }
    }
  }

  post {
    failure {
      echo 'Pipeline failed'
    }
    success {
      echo 'Pipeline succeeded'
    }
    always {
      cleanWs()
    }
  }
}
