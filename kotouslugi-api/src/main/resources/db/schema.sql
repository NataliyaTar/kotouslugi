-- ==========================================
-- ТРЕБОВАНИЕ №1: ВЫСТАВКИ
-- ==========================================

CREATE TABLE IF NOT EXISTS exhibition (
                                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                        name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  venue_address VARCHAR(500),
  event_date DATE NOT NULL,
  event_end_date DATE,
  felinological_system VARCHAR(50) NOT NULL,
  organizer VARCHAR(255),
  entry_fee DECIMAL(10, 2) NOT NULL,
  application_deadline DATE NOT NULL,
  description VARCHAR(2000),
  rules VARCHAR(2000),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE IF NOT EXISTS exhibition_application (
                                                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                    exhibition_id BIGINT NOT NULL,
                                                    cat_id BIGINT NOT NULL,
                                                    user_id BIGINT NOT NULL,
                                                    cat_nickname VARCHAR(100) NOT NULL,
  cat_breed VARCHAR(100) NOT NULL,
  cat_gender VARCHAR(20) NOT NULL,
  cat_birth_date DATE NOT NULL,
  cat_color VARCHAR(100),
  pedigree_number VARCHAR(100),
  participation_class VARCHAR(50) NOT NULL,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  status VARCHAR(30) DEFAULT 'НА_РАССМОТРЕНИИ',
  application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  catalog_number VARCHAR(50),
  FOREIGN KEY (exhibition_id) REFERENCES exhibition(id)
  );

CREATE TABLE IF NOT EXISTS exhibition_document (
                                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                 application_id BIGINT NOT NULL,
                                                 document_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES exhibition_application(id)
  );

CREATE TABLE IF NOT EXISTS exhibition_notification (
                                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                     application_id BIGINT NOT NULL,
                                                     user_id BIGINT NOT NULL,
                                                     notification_type VARCHAR(50) NOT NULL,
  message VARCHAR(2000) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (application_id) REFERENCES exhibition_application(id)
  );

CREATE TABLE IF NOT EXISTS exhibition_review (
                                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                               application_id BIGINT NOT NULL,
                                               user_id BIGINT NOT NULL,
                                               exhibition_id BIGINT NOT NULL,
                                               organization_rating INT NOT NULL CHECK (organization_rating >= 1 AND organization_rating <= 5),
  expert_rating INT CHECK (expert_rating >= 1 AND expert_rating <= 5),
  comment_text VARCHAR(2000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES exhibition_application(id),
  FOREIGN KEY (exhibition_id) REFERENCES exhibition(id)
  );

-- ==========================================
-- ТРЕБОВАНИЕ №2: ПОДБОР ПАРТНЕРА
-- ==========================================

CREATE TABLE IF NOT EXISTS breeding_profile (
                                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                              cat_id BIGINT NOT NULL,
                                              user_id BIGINT NOT NULL,
                                              nickname VARCHAR(100) NOT NULL,
  breed VARCHAR(100) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  city VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  color VARCHAR(100),
  pedigree_number VARCHAR(100),
  has_pedigree BOOLEAN DEFAULT FALSE,
  photo_main VARCHAR(500),
  description VARCHAR(2000),
  preferred_breed VARCHAR(100),
  preferred_gender VARCHAR(20),
  preferred_city VARCHAR(100),
  additional_requirements VARCHAR(2000),
  status VARCHAR(30) DEFAULT 'АКТИВНА',
  views_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE IF NOT EXISTS breeding_request (
                                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                              from_profile_id BIGINT NOT NULL,
                                              to_profile_id BIGINT NOT NULL,
                                              from_user_id BIGINT NOT NULL,
                                              to_user_id BIGINT NOT NULL,
                                              message VARCHAR(2000),
  status VARCHAR(30) DEFAULT 'НА_РАССМОТРЕНИИ',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP,
  response_comment VARCHAR(2000),
  FOREIGN KEY (from_profile_id) REFERENCES breeding_profile(id),
  FOREIGN KEY (to_profile_id) REFERENCES breeding_profile(id)
  );

CREATE TABLE IF NOT EXISTS breeding_notification (
                                                   id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                   request_id BIGINT NOT NULL,
                                                   user_id BIGINT NOT NULL,
                                                   notification_type VARCHAR(50) NOT NULL,
  message VARCHAR(2000) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (request_id) REFERENCES breeding_request(id)
  );

CREATE TABLE IF NOT EXISTS breeding_review (
                                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                             request_id BIGINT NOT NULL,
                                             from_user_id BIGINT NOT NULL,
                                             to_user_id BIGINT NOT NULL,
                                             rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment_text VARCHAR(2000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES breeding_request(id)
  );
