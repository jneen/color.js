SOURCE_DIR = lib
LIB_NAME = color

SRC = \
${SOURCE_DIR}/color.js

BUILD_DIR = ./build
BUILD_FILE = ${BUILD_DIR}/${LIB_NAME}.js
MINIFIED_BUILD_FILE = ${BUILD_DIR}/${LIB_NAME}.min.js

all: minify

${BUILD_FILE}: ${SRC}
	[ -d "${BUILD_DIR}" ] || mkdir "${BUILD_DIR}"
	cat ${SRC} > "${BUILD_FILE}"

${MINIFIED_BUILD_FILE}: ${BUILD_FILE}
	uglifyjs "${BUILD_FILE}" > "${MINIFIED_BUILD_FILE}"

.PHONY: minify
minify: ${MINIFIED_BUILD_FILE}

.PHONY: test
test: ${BUILD_FILE}
	NODE_PATH=${BUILD_DIR} node test/test.js
