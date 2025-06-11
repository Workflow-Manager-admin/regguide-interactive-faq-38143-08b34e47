#!/bin/bash
cd /home/kavia/workspace/code-generation/regguide-interactive-faq-38143-08b34e47/regguide_interactive_faq
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

