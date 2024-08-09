import React from "react";
import TopBar from "../TopBar/TopBar";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div>
      <TopBar />
      <div className="about-container">
        <div className="top-section"></div>
        <div className="title-container">
          <h1>
            Sunny Teknoloji Ar&Ge Merkezi Projeleri ve Teydeb Projeleri İş
            Paketleri ve Adam/Saat Takip Portalı
          </h1>
        </div>
        <div className="content-container numbered-section">
          <h2 className="numbered">BAŞLANGIÇ</h2>
          <p className="content">
            Çalışanların "Meslek/Uzmanlık Alanları"nı ve "Kullanıcılar"ın
            bilgilerini ilgili başlıklardan doldurunuz.
          </p>
          <h2 className="numbered">PROJE AYLIK ORANLARI</h2>
          <p className="content">
            Oranlar bölümünde aylık olarak kişilere atanabilecek kesir
            sayılarının değerlerini tanımlayınız.
          </p>
          <h2 className="numbered">PROJE VE İŞ PAKETLERİ</h2>
          <p className="content">
            Projeler ve İşler başlıkları üzerinden yeni projeler, bu projelerin
            üyeleri ve işleri ile işlerin aylık dağılımındaki kişilere atanan
            oranları girebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
