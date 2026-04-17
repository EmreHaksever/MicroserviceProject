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
                // Sadece imajları oluşturur
                sh 'docker-compose build'
            }
        }

        stage('Canlıya Al (Deploy)') {
            steps {
                // Listeye datadog-agent'ı da ekledik
                sh 'docker-compose -p microserviceproject up -d user-service vehicle-service rental-service mongo datadog-agent'
                echo 'Sistem ve Datadog Ajanı güncellendi! 🚀'
            }
        }
    
    post {
        success {
            echo 'Harika! Build ve Deploy başarıyla tamamlandı.'
        }
        failure {
            echo 'Hata! Deploy aşamasında bir çakışma yaşandı.'
        }
    }
}