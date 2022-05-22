#!/bin/sh

# Defino los inputs, variables y constantes
mode="$1"
camelCaseName="$2View"

kebabCaseName=$(echo "$camelCaseName" \
     | sed 's/\(.\)\([A-Z]\)/\1-\2/g' \
     | tr '[:upper:]' '[:lower:]')



# Defino las variables que se van a reemplazar en el template
SETTINGS="kebab-name CamelName" # Las claves que se van a reemplazar
values="$kebabCaseName $camelCaseName" # Los valores por los que se va a reemplazar TODO: Armar esto

# Los paso a un array
settingsArray=(`echo $SETTINGS | sed 's/,/\n/g'`)
valuesArray=(`echo $values | sed 's/,/\n/g'`)

# Defino rutas
folderName="common";
if [ "$mode" = "creator" ]; then
  folderName="creator-mode"
fi
if [ "$mode" = "audience" ]; then
  folderName="audience-mode"
fi
if [ "$mode" = "test" ]; then
  folderName="test-mode"
fi


scriptPath="$(dirname "$0")" # Ruta de este script
outputPath="$scriptPath/../../../../game/view/$folderName/$kebabCaseName" # Carpeta donde se va a copiar la vista

# Copio templates
mkdir "$outputPath"
cp "$scriptPath/template.js" "$outputPath/$kebabCaseName.js"
cp "$scriptPath/template.scss" "$outputPath/$kebabCaseName.scss"
cp "$scriptPath/template.html" "$outputPath/$kebabCaseName.html"

# Reemplazo las settings por los valores

for i in 0 1
do
  sed -i "" "s;%${settingsArray[i]}%;${valuesArray[i]};g" "$outputPath/$kebabCaseName.js"
  sed -i "" "s;%${settingsArray[i]}%;${valuesArray[i]};g" "$outputPath/$kebabCaseName.scss"
  sed -i "" "s;%${settingsArray[i]}%;${valuesArray[i]};g" "$outputPath/$kebabCaseName.html"
done

