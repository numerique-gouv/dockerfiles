FROM erikvl87/languagetool

USER root
COPY ignore.txt ignore.txt
RUN  (echo; cat ignore.txt) >> org/languagetool/resource/fr/hunspell/ignore.txt
USER languagetool
