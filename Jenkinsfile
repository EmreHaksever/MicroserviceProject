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

        stage('Canlıya Al (Deploy)') { // İŞTE EKSİK OLAN VE SENİN SORDUĞUN KISIM!
            steps {
                // Jenkins imajı oluşturduktan sonra sistemi otomatik günceller
                sh 'docker-compose up -d'
                echo 'Sistem otomatik olarak güncellendi ve yeni versiyon yayına alındı! 🚀'
            }
        }
    }
    
    post {
        success {
            echo 'Harika! Tüm süreç (Build + Deploy) başarıyla tamamlandı.'
        }
        failure {
            echo 'Hata! Bir şeyler ters gitti.'
        }
    }
}