import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Spin, message } from 'antd';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await fetch(`http://localhost:8080/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          }
        });
        if (!response.ok) {
          const errorText = await response.text(); 
          throw new Error(`Ağ yanıtı uygun değil: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const projectData = await response.json();
        setProject(projectData);
      } catch (error) {
        console.error('Proje detayları getirilirken hata oluştu:', error);
        message.error('Proje detayları getirilirken hata oluştu: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return <div>Proje bulunamadı</div>;
  }

  const titleStyle = {
    color: '#02457A', 
    fontSize: '30px',
  };
  

  return (
    <div  style={{  marginLeft: "20px", color: "#02457A",marginRight: "20px" }}>
    <Descriptions title={<span style={titleStyle}>{project.projectName}</span>} bordered>
      <Descriptions.Item label="Proje Kodu" >{project.projectCode}</Descriptions.Item>
      <Descriptions.Item label="Başlama Tarihi">{project.startDate}</Descriptions.Item>
      <Descriptions.Item label="Bitiş Tarihi">{project.endDate}</Descriptions.Item>
      <Descriptions.Item label="Açıklama">{project.description}</Descriptions.Item>
      <Descriptions.Item label="Oluşturma Tarihi">{project.creationDate}</Descriptions.Item>
      <Descriptions.Item label="Durum">{project.isActive ? 'Aktif' : 'Pasif'}</Descriptions.Item>
      <Descriptions.Item label="Kategori">{project.category}</Descriptions.Item>
    </Descriptions>
  </div>
  );
};

export default ProjectDetails;
