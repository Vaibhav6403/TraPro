pipeline {
    agent any

    // environment {
    //     NODE_ENV = 'production'
    // }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm ci'  // uses package-lock.json for clean installs
            }
        }

        // stage('Lint') {
        //     steps {
        //         bat 'npm run lint' 
        //     }
        // }

        stage('Build') {
            steps {
                bat 'npm run build'
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
