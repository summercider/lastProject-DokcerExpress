#Dockerfile

#nodejs 20ver 공식 이미지
FROM node:20-alpine
# 컨테이너 dir 설정
WORKDIR /app
# package,package-lock 디렉토리 복사, 의존성설치 
COPY package.json package-lock.json ./
#빌드시 dev 디펜던시 제외
ENV NODE_ENV=production
RUN npm install --omit=dev
#현재 파일 WORKDIR에 복사
COPY . . 
#컨테이너 실행시 명령어 
CMD ["npm", "start"]
# 컨테이너 내부 사용포트
EXPOSE 3001 