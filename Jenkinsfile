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
                sh 'npm ci'  // uses package-lock.json for clean installs
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'  // optional, if you have linting setup
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        
    }

    post {
        success {
            echo '✅ Frontend build succeeded!'
        }
        failure {
            echo '❌ Frontend build failed!'
        }
    }
}
