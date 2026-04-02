// Step 1 baseline: adaptive module file exists in final target structure.
module.exports = {
  pickNextTopic: () => null, 
  pickNextSkill: function pickNextSkill(memory) {
                const skills = Object.entries(memory.skills || {});

                if (!skills.length) return "basics";

                return skills.sort((a, b) => a[1].level - b[1].level)[0][0];
              }
};
