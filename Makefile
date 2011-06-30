SOURCE_DIR = lib
LIB_NAME = color

FILES = \
${SOURCE_DIR}/color.js

BUILD_DIR = ./build
BUILD_FILE = ${BUILD_DIR}/${LIB_NAME}.js
MINIFIED_BUILD_FILE = ${BUILD_DIR}/${LIB_NAME}.min.js

all: cat minify

cat:
	[ -d "${BUILD_DIR}" ] || mkdir "${BUILD_DIR}"
	cat ${FILES} > "${BUILD_FILE}"

minify: cat
	which uglifyjs >/dev/null && \
    uglifyjs "${BUILD_FILE}" > "${MINIFIED_BUILD_FILE}"

lol:
	@@echo "LOL!"
