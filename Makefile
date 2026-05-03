.PHONY: help install dev mobile web android ios test typecheck validate doctor

help:
	@echo "Comandos disponiveis:"
	@echo "  make install    Instala as dependências"
	@echo "  make dev        Inicia o Expo para testar no celular"
	@echo "  make web        Inicia o app no navegador"
	@echo "  make android    Inicia o Expo com alvo Android"
	@echo "  make ios        Inicia o Expo com alvo iOS"
	@echo "  make test       Roda os testes automatizados"
	@echo "  make typecheck  Roda a validação TypeScript"
	@echo "  make validate   Roda testes e typecheck"
	@echo "  make doctor     Roda o diagnostico do Expo"

install:
	npm install

dev:
	npm run dev:mobile

mobile: dev

web:
	npm run web:mobile

android:
	npm run android:mobile

ios:
	npm run ios:mobile

test:
	npm test

typecheck:
	npm run typecheck

validate: test typecheck

doctor:
	npx expo-doctor
