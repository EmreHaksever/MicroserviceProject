pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Sürüm Kontrolü') {
            steps {
                sh 'docker --version'
                sh 'docker-compose --version'
            }
        }

        stage('Mikroservisleri Derle (Build)') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Canlıya Al (Deploy)') {
            steps {
                // Datadog ajanını da listeye eklediğimizden emin oluyoruz
                sh 'docker-compose -p microserviceproject up -d user-service vehicle-service rental-service mongo datadog-agent'
                echo 'Sistem ve Datadog Ajanı güncellendi! 🚀'
            }
        }
    }

    post {
        success {
            echo 'Harika! Build ve Deploy başarıyla tamamlandı.'
        }
        failure {
            echo 'Hata! Jenkinsfile içinde veya süreçte bir sorun var.'
        }
    }
}