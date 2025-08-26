-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for voice styles
CREATE TYPE voice_style AS ENUM (
  '따뜻하게',
  '활기차게', 
  '차분하게',
  '전문적으로',
  '친근하게'
);

-- Create enum for content categories
CREATE TYPE content_category AS ENUM (
  '필수정보',
  '호스트스토리'
);

-- Create enum for content types
CREATE TYPE content_type AS ENUM (
  '와이파이',
  '환영메시지',
  '체크인',
  '체크아웃',
  '숙소소개',
  '주변정보',
  '기타'
);

-- Hosts table (호스트 정보)
CREATE TABLE hosts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties table (숙소 정보)
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES hosts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  qr_code_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content templates table (콘텐츠 템플릿)
CREATE TABLE content_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  category content_category NOT NULL,
  content_type content_type NOT NULL,
  title TEXT NOT NULL,
  text_content TEXT NOT NULL,
  voice_style voice_style DEFAULT '따뜻하게',
  temperature FLOAT DEFAULT 0.3,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique combination of property, category, and content_type
  UNIQUE(property_id, category, content_type)
);

-- Generated audio files table (생성된 오디오 파일)
CREATE TABLE audio_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_template_id UUID REFERENCES content_templates(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  duration FLOAT,
  sampling_rate INTEGER,
  voice_style voice_style,
  temperature FLOAT,
  replicate_prediction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guest sessions table (게스트 세션)
CREATE TABLE guest_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Audio playback logs table (오디오 재생 로그)
CREATE TABLE audio_playback_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audio_file_id UUID REFERENCES audio_files(id) ON DELETE CASCADE,
  guest_session_id UUID REFERENCES guest_sessions(id) ON DELETE CASCADE,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  play_duration FLOAT,
  completed BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX idx_properties_host_id ON properties(host_id);
CREATE INDEX idx_content_templates_property_id ON content_templates(property_id);
CREATE INDEX idx_audio_files_content_template_id ON audio_files(content_template_id);
CREATE INDEX idx_audio_files_property_id ON audio_files(property_id);
CREATE INDEX idx_guest_sessions_property_id ON guest_sessions(property_id);
CREATE INDEX idx_guest_sessions_session_token ON guest_sessions(session_token);
CREATE INDEX idx_audio_playback_logs_audio_file_id ON audio_playback_logs(audio_file_id);
CREATE INDEX idx_audio_playback_logs_guest_session_id ON audio_playback_logs(guest_session_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_hosts_updated_at BEFORE UPDATE ON hosts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_templates_updated_at BEFORE UPDATE ON content_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default content templates for a new property
CREATE OR REPLACE FUNCTION create_default_templates(property_uuid UUID)
RETURNS VOID AS $$
BEGIN
  -- 필수 정보 템플릿들
  INSERT INTO content_templates (property_id, category, content_type, title, text_content, voice_style) VALUES
    (property_uuid, '필수정보', '와이파이', 'Wi-Fi 정보', '와이파이 비밀번호는 [비밀번호]입니다. 연결에 문제가 있으시면 언제든 연락주세요.', '전문적으로'),
    (property_uuid, '필수정보', '환영메시지', '환영 메시지', '안녕하세요! [숙소명]에 오신 것을 환영합니다. 편안한 휴식을 즐기시기 바랍니다.', '따뜻하게'),
    (property_uuid, '필수정보', '체크인', '체크인 안내', '체크인 시간은 오후 3시입니다. 체크인 전까지는 짐을 맡겨드릴 수 있습니다.', '친근하게'),
    (property_uuid, '필수정보', '체크아웃', '체크아웃 안내', '체크아웃 시간은 오전 11시입니다. 늦어도 오후 12시까지는 정리해주세요.', '친근하게');
    
  -- 호스트 스토리 템플릿들
  INSERT INTO content_templates (property_id, category, content_type, title, text_content, voice_style) VALUES
    (property_uuid, '호스트스토리', '숙소소개', '숙소 소개', '우리 숙소는 [위치]에 위치해 있어요. [특징]을 감상하실 수 있습니다.', '친근하게'),
    (property_uuid, '호스트스토리', '주변정보', '주변 정보', '주변에는 [주변명소]가 있어요. [추천사항]을 추천드립니다.', '활기차게'),
    (property_uuid, '호스트스토리', '기타', '특별한 이야기', '[특별한 이야기나 팁을 여기에 작성해주세요]', '차분하게');
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create default templates for new properties
CREATE OR REPLACE FUNCTION trigger_create_default_templates()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_default_templates(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_default_templates_trigger
  AFTER INSERT ON properties
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_default_templates();
