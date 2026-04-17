pipeline {
    agent any // Herhangi bir müsait Jenkins ajanı üzerinde çalıştır

    stages {
        stage('Checkout') {
            steps {
                // Kodları GitHub'dan çeker
                checkout scm
            }
        }

        stage('Docker Sürüm Kontrolü') {
            steps {
                // Jenkins sunucusunun Docker'a erişimi var mı diye test ediyoruz
                sh 'docker --version'
                sh 'docker-compose --version'
            }
        }

        stage('Mikroservisleri Derle (Build)') {
            steps {
                // Tüm servislerin Docker imajlarını test amaçlı derler
                sh 'docker-compose build'
            }
        }
    }
    
    post {
        success {
            echo 'Harika! Tüm mikroservisler başarıyla derlendi.'
        }
        failure {
            echo 'Hata! Kodlarda veya Dockerfile içinde bir sorun var.'
        }
    }
}